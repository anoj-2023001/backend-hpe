// limitar la cantidad de solicitudes en cierto tiempo

import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 10 * 1000,
        max: 100,
            message:{
                message: "You're blocked wait 10 minutes"
            }

    }
)