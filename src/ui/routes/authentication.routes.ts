import express from 'express';

import { signupController } from '../controllers/authentication/signup-controller';

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', signupController);

export default authenticationRouter;
