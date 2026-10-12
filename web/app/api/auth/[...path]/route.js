import { auth } from '../../../../lib/auth';
export const runtime = 'nodejs';
export const { GET, POST } = auth.handler();
