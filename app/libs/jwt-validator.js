const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
const request = require("request");

exports.default = () => {
  return (req, res, next) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    console.log("Token...", token);

    const decodedJwt = jwt.decode(token, {
      complete: true,
    });

    console.log(decodedJwt);
    if (!decodedJwt) {
      return res
        .status(200)
        .json({ status: 0, message: "Not a valid JWT Token" });
    }
    if (decodedJwt.payload.iss !== process.env.AWS_COGNITO_AUTHORITY) {
      return res.status(200).json({
        status: 0,
        message: "Invalid issuer: " + decodedJwt.payload.iss,
      });
    }

    if (decodedJwt.payload.iss !== process.env.AWS_COGNITO_AUTHORITY) {
      return res
        .status(200)
        .json({ status: 0, message: "Invalid iss: " + decodedJwt.payload.iss });
    }
    request(
      {
        url: process.env.AWS_COGNITO_AUTHORITY + "/.well-known/jwks.json",
        json: true,
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          //console.log(body);
          pems = {};
          var keys = body["keys"];
          for (var i = 0; i < keys.length; i++) {
            var key_id = keys[i].kid;
            var modulus = keys[i].n;
            var exponent = keys[i].e;
            var key_type = keys[i].kty;
            var jwk = { kty: key_type, n: modulus, e: exponent };
            var pem = jwkToPem(jwk);
            pems[key_id] = pem;
          }
          var kid = decodedJwt.header.kid;
          var pem = pems[kid];
          if (!pem) {
            //context.fail("Unauthorized");
            res
              .status(200)
              .json({ status: 0, message: "Invalid token: Unauthorized" });
            return;
          }
          jwt.verify(token, pem, (err, decoded) => {
            if (err) {
              return res
                .status(200)
                .json({ status: 0, message: "Token validation failed" });
            }
            req.user = decoded;
            console.log("JWT Validation passed");
            next();
          });
        } else {
          return res
            .status(200)
            .json({ status: 0, message: "JWK json download failed" });
        }
      }
    );
  };
};
