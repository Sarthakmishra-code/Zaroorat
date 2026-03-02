import { pathToFileURL } from 'url';
import path from 'path';

async function testImport(filePath) {
    const url = pathToFileURL(path.resolve(filePath)).href;
    try {
        await import(url);
        console.log(`OK: ${filePath}`);
    } catch (err) {
        if (err.code === 'ERR_MODULE_NOT_FOUND') {
            console.error(`ERROR in ${filePath}: ${err.message}`);
        } else {
            // Probably a different error (like a missing variable)
            console.warn(`WARN in ${filePath}: ${err.message}`);
        }
    }
}

const filesToTest = [
    'src/config/db.js',
    'src/models/user.model.js',
    'src/models/car.model.js',
    'src/models/bike.model.js',
    'src/models/hostel.model.js',
    'src/models/order.model.js',
    'src/models/reviews.model.js',
    'src/utils/ApiError.js',
    'src/utils/ApiResponse.js',
    'src/utils/asyncHandler.js',
    'src/utils/cloudinary.js',
    'src/middlewares/auth.middleware.js',
    'src/middlewares/multer.middleware.js',
    'src/controllers/user.controller.js',
    'src/controllers/car.controller.js',
    'src/controllers/bike.controller.js',
    'src/controllers/hostel.controller.js',
    'src/controllers/order.controller.js',
    'src/controllers/admin.controller.js',
    'src/routes/user.routes.js',
    'src/routes/car.routes.js',
    'src/routes/bike.routes.js',
    'src/routes/hostel.routes.js',
    'src/routes/order.routes.js',
    'src/routes/admin.routes.js',
    'src/app.js',
    'src/index.js'
];

console.log("Starting diagnostic import test...");
for (const file of filesToTest) {
    await testImport(file);
}
console.log("Diagnostic complete.");
