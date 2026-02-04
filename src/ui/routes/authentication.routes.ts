import express from 'express';

import { signupController } from '../controllers/authentication/signup-controller';
import { signinController } from '../controllers/authentication/signin-controller';

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', signupController);
authenticationRouter.post('/signin', signinController);

export default authenticationRouter;
