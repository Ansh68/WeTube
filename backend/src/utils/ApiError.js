class ApiError extends Error{
    constructor(
        statuscode,
        message= "Something Went Wrong",
        errors=[],
        stack= ""
    ){
        super(message);
        this.statuscode= statuscode
        this.errors=  errors
        this.stack= stack
        this.data= null
        this.success= false;
    }
}

export {ApiError};