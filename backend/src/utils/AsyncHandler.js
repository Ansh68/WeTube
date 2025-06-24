const AsyncHandler =(RequestHandle)=> (req,res,next)=>{
    return Promise.resolve(RequestHandle(req,res,next))
    .catch((err)=>next (err));
}



export default AsyncHandler;