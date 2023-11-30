const {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} = require("amazon-cognito-identity-js");

const userPool = new CognitoUserPool({
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID,
});

exports.registerUser = async (authRegisterUserDto) => {
  const { firstName, email, password } = authRegisterUserDto;

  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      [
        new CognitoUserAttribute({
          Name: "name",
          Value: firstName,
        }),
      ],
      null,
      (err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

exports.authenticateUser = async (authLoginUserDto) => {
  const { email, password } = authLoginUserDto;
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userCognito = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    userCognito.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
          user: result.getIdToken().decodePayload(),
        });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

exports.confirmUserPassword = async (authConfirmPasswordUserDto) => {
  const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const userCognito = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    userCognito.confirmPassword(confirmationCode, newPassword, {
      onSuccess: () => {
        resolve({ status: "success" });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};
