const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
}; 

export { asyncHandler };


// Note : Abhe error ka koi structure nhi hai hamra pass --> b/c maan kara status code bhej deya or maan kara to status code nhi bhe bheja , maan kara to json res bhej deya and maan kara to json response nhi bhe bhej aa --> to esko bhe to ek centralize format mein huma rakhna pada ga 

// --> To basically ab mein API ka error bhe standarize karna chata hu and mein API ka response bhe standarize karna chata hu --> thoda code bada ho jaya ga ess sa but hamra code standarize ho jaya ga.







// It is an higher order function --> b/c ye func -> functions ko as a parameter bhe accept kar skta hai and functions ko return bhe kar skta hai
// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}} -->  Ab esko asa bhe likh skta ho const asyncHandler = (func) => () => {} --> basically yaha par aap function ko as a parameter accept kar raha ho and usko execute bhe kar raha ho vhi par

// const asyncHandler = (func) => async () => {} --> agar function ko async bana ho jisko execute kar raha ho to usko kuch aisa 'async' bana skta ho



// ye hum ne ek wrapper function bana deya hai jo ke hum agaa jaa kar har jagaa use karna wala hai

// ye syntax hum use nhi kara ga hum promise wala syntax use kara ga 

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   }
//   catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// --> Bascially asyncHandler hamra route functions ko try-catch mein wrap karna mein help karta hai 