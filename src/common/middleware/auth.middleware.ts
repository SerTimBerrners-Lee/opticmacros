import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import '../types/express';

export const authMiddleware = (path: string[]) => (req: Request, res: Response, next: NextFunction) => {
	if (path.includes(req.path)) {
		return next();
	}

	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).send('Access denied. No token provided.');
	}

	try {
		const decoded = jwt.verify(token, 'opticmacros');
		req.user = decoded;
		next();
	} catch (err) {
		res.status(400).send('Invalid token.');
	}
};