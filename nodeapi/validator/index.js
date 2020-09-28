exports.createPostValidator = (req, res, next) =>{
//title
  req.check('title', "Write a title").notEmpty();
  req.check('title', "Title must be between 4 and 150 characters").isLength({
    min: 4,
    max: 150
  });
  //body
    req.check('body', "Write a body").notEmpty();
    req.check('body', "Body must be between 4 and 2000 characters").isLength({
      min: 4,
      max: 2000
    });
    //check for errors
    const errors = req.validationErrors()
    //if error show the first one as they happen
    if(errors){
      const firstError = errors.map((error)=>error.msg)[0];
      return res.status(400).json({error: firstError})
    }

    //proceed to the next middleware
    next();
}

exports.createCommentValidator = (req, res, next) =>{
    //body
      req.check('body', "Write a body").notEmpty();
      req.check('body', "Body must be between 4 and 2000 characters").isLength({
        min: 4,
        max: 500
      });
      //check for errors
      const errors = req.validationErrors()
      //if error show the first one as they happen
      if(errors){
        const firstError = errors.map((error)=>error.msg)[0];
        return res.status(400).json({error: firstError})
      }
      //proceed to the next middleware
      next();
  }

exports.userSignupValidator = (req, res, next) => {
  //name is not null and between 4-10 characters
  req.check("name","Name must be between 4 and 200 characters")
    .notEmpty()
    .isLength({
      min: 4,
      max: 200
    });
  //email is not null, valid, and normalized
  req.check("email", "Email must be between 3 and 200 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 3,
      max: 200
    })
  //check for password
  req.check("password", "Password is required").notEmpty();
  req.check("password")
    .isLength({min: 8})
    .withMessage("Password must contain at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");

  //check for errors
  const errors = req.validationErrors()
  if(errors){
    const firstError = errors.map((error)=>error.msg)[0];
    return res.status(400).json({error: firstError})
  }
  
  //proceed to next middleware
  next();
}

exports.passwordResetValidator = (req, res, next) => {
  // check for password
  req.check("newPassword", "Password is required").notEmpty();
  req.check("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long")
      .matches(/\d/)
      .withMessage("Password must contain a number");

  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
      const firstError = errors.map(error => error.msg)[0];
      return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware or ...
  next();
};
