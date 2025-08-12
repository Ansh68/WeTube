const AsyncHandler =(RequestHandle)=> async (req,res,next)=>{
    try {
        return await Promise.resolve(RequestHandle(req, res, next));
    } catch (err) {
        return next(err);
    }
}



export default AsyncHandler;