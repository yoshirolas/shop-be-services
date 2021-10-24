'use strict';

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};


module.exports.invoke = async (event, context, callback) => {
    try {
        if (event.type !== 'TOKEN') callback("Unauthorized");
    
        const token = event.authorizationToken;
        const [tokenPrefix, tokenData] = token.split(' ');
        const tokenDataBuffer = Buffer.from(tokenData, 'base64');
        const [userName, userPassword] = tokenDataBuffer.toString('utf-8').split(':');
    
        const isValidPassword = (password) => process.env[userName] && password === process.env[userName];
        // console.log('isValidPassword: ', isValidPassword(userPassword))
        // console.log('userName', userName);
        // console.log('userPassword', userPassword);
    
        const effect = isValidPassword(userPassword) ? 'Allow' : 'Deny';
        callback(null, generatePolicy(tokenData, effect, event.methodArn));
        
    } catch (error) {
        callback("Unauthorized", error.message); // Return a 401 Unauthorized response
    }
};