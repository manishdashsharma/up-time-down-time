import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../services/CustomError.js'
import Monitor from '../models/monitor.schema.js'

/**
 * Registers a new website link for the user.
 * Validates provided 'name' and 'link' fields, ensuring they are not empty.
 * Checks if the user has reached the maximum limit of monitored links before allowing registration.
 */
const registerWebsite = asyncHandler(async (req, res) => {
    const { name, link } = req.body;
    const user = req.user;

    if (![name, link].every(field => field && field.trim())) {
        throw new CustomError("Please add all fields", 400);
    }

    const existingMonitoredData = await Monitor.find({ userId: user?._id });

    if (user?.is_paid || existingMonitoredData.length < 5) {
        const monitoredData = await Monitor.create({
            name,
            link,
            userId: user?._id
        });

        if (!monitoredData) {
            throw new CustomError("The monitored data was not saved", 400);
        }

        return res.
        status(201)
        .json({
            success: true,
            message: 'Link registered successfully',
            monitoredData 
        });
    } else {
        throw new CustomError("Sorry, you have reached the maximum limit", 400);
    }
});

/**
 * Retrieves monitored website data for a specific user.
 * Fetches all monitored data associated with the logged-in user.
 */
const getMonitoredWebsiteByUserId = asyncHandler( async( req, res) => {
    const monitoredData = await Monitor.find({userId : req.user?._id});

    if(!monitoredData){
        throw new CustomError("You have not yet registered websites to monitor", 404);
    }
    return res.
    status(201)
    .json({
        success: true,
        message: 'List of registered website links',
        monitoredData 
    });
})

/**
 * Retrieves monitored website data by its unique ID.
 * Fetches monitored data based on the provided monitoredDataId.
 */
const getMonitoredWebsiteById = asyncHandler( async( req, res) => {
    const {id: monitoredDataId} = req.params

    const monitoredData = await Monitor.findById(monitoredDataId)

    if(!monitoredData){
        throw new CustomError("You have not yet registered websites to monitor", 404);
    }
    return res.
    status(200)
    .json({
        success: true,
        message: 'List of registered website links',
        monitoredData 
    });
})

/**
 * Deletes monitored website data by its unique ID.
 * Finds and deletes monitored data based on the provided monitoredDataId.
 */
const deleteMonitoredWebsiteDataById = asyncHandler( async( req, res) =>{
    const {id: monitoredDataId} = req.params

    const monitoredData = await Monitor.findByIdAndDelete(monitoredDataId)

    if(!monitoredData){
        throw new CustomError("No registered link found",404)
    }

    return res.
    status(200)
    .json({
        success: true,
        message: 'Linked monitored data deleted successfully',
    });

})

/**
 * Deletes all monitored website data for a specific user.
 * Finds and deletes all monitored data associated with the logged-in user.
 */
const deleteMonitoredWebsiteDataByUserId = asyncHandler( async( req, res) =>{
    const deletedData = await Monitor.deleteMany({ userId: req.user?._id });

    if (deletedData.deletedCount === 0) {
        throw new CustomError("No registered link found", 404);
    }

    return res.
    status(200)
    .json({
        success: true,
        message: `${deletedData.deletedCount} data deleted successfully`,

    });

})

export { 
    registerWebsite ,
    getMonitoredWebsiteByUserId,
    getMonitoredWebsiteById,
    deleteMonitoredWebsiteDataById,
    deleteMonitoredWebsiteDataByUserId
}