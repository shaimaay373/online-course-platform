export default (err,req,res,next)=>{
    console.log(err);
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server error";
     let errors = err.errors;

     if(err.name ==="ValidationError"){
        statusCode=400;
        errors = Object.values(err.errors).map((el)=>({
              field: el.path,
      message: el.message,
        }));
            message = "Validation failed";

     }
   if(err.code=== 11000){
    statusCode =400;
    const field = Object.keys(err.keyValue)[0];
    const value =err.keyValue[field]
       message = `${field} '${value}' already exists`;
   }

    res.status(statusCode).json({
    status: "ُError something went wrong",
    message,
    ...(errors && { errors }),
  });
};
