import { User } from "./src/models/user.model.js";
import { Bike } from "./src/models/bike.model.js";
import { Car } from "./src/models/car.model.js";
import { Hostel } from "./src/models/hostel.model.js";
import { Order } from "./src/models/order.model.js";
import { Comment } from "./src/models/reviews.model.js";

import userRouter from "./src/routes/user.routes.js";
import bikeRouter from "./src/routes/bike.routes.js";
import carRouter from "./src/routes/car.routes.js";
import hostelRouter from "./src/routes/hostel.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import adminRouter from "./src/routes/admin.routes.js";

console.log("All routes and models imported successfully");

