import {
  AuthorizationNotifier, AuthorizationRequest,
  AuthorizationServiceConfiguration, BaseTokenRequestHandler,
  FetchRequestor,
  RedirectRequestHandler, TokenRequest, BasicQueryStringUtils, GRANT_TYPE_AUTHORIZATION_CODE
} from "@openid/appauth";

const CLIENT_ID = "bar";
const REDIRECT_URI = "https://oidcclient.com:6060/redirect"

const getBaseQueryUtils = () => {
  return new class extends BasicQueryStringUtils {
    parse(input, useHash) {
      return super.parse(input, false);
    }
  }
}

const getRequestor = () => {
  return new FetchRequestor();
}

const getConfiguration = async () => {
  const requestor = getRequestor();
  return await AuthorizationServiceConfiguration.fetchFromIssuer("https://oidcprovider.com", requestor);
}

const getNotifier = (cb) => {
  const notifier = new AuthorizationNotifier();
  notifier.setAuthorizationListener(cb);
  return notifier;
}

const getAuthorizationHandler = async (cb = () => {}) => {
  const notifier = await getNotifier(cb)
  const basicQueryStringUtils = getBaseQueryUtils()
  const authorizationHandler = new RedirectRequestHandler(undefined, basicQueryStringUtils);
  authorizationHandler.setAuthorizationNotifier(notifier);
  return authorizationHandler;
}

const getTokenHandler = async (request, response, error) => {
  const requestor = getRequestor()
  const basicQueryStringUtils = getBaseQueryUtils()
  const tokenHandler = new BaseTokenRequestHandler(requestor, basicQueryStringUtils)

  return tokenHandler;
}

const login = async () => {
  const configuration = await getConfiguration()
  const authorizationHandler = await getAuthorizationHandler();

  let request = new AuthorizationRequest({
    client_id: CLIENT_ID,
    scope: "openid offline_access profile",
    response_type: "code",
    grant_type: "authorization_code",
    state: undefined,
    extras: {
      display: "popup",
      prompt: "consent",
      access_type: "offline",
    },
    redirect_uri: REDIRECT_URI
  })

  authorizationHandler.performAuthorizationRequest(configuration, request)
}

export const verifyCallback = async (setAccessToken) => {
  const authorizationHandler = await getAuthorizationHandler(async (request, response, error) => {
    const tokenResponse = await token(request, response, error);
    console.log("tokenResponse: ", tokenResponse)
    setAccessToken(tokenResponse.accessToken)
  })

  await authorizationHandler.completeAuthorizationRequestIfPossible();
}

export const token = async (request, response, error) => {
  console.log("request: ", request);
  console.log("response: ", response);
  console.log("error: ", error);
  const configuration = await getConfiguration();
  const tokenHandler = await getTokenHandler(request, response, error);

  let extras = undefined;

  console.log("request: ", request);

  if(request && request.internal) {
    extras = {}
    // extras.client_secret = "foo";
    extras["code_verifier"] = request.internal["code_verifier"];
  }

  const tokenRequest = new TokenRequest({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
    code: response.code,
    refresh_token: undefined,
    extras,
  })

  return await tokenHandler.performTokenRequest(configuration, tokenRequest)
}

export default login;