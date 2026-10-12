import { redirect } from 'next/navigation';
import { auth } from '../lib/auth';

export const dynamic = 'force-dynamic';
export default async function Home() {
  if (process.env.CLINOVYRA_LIVE_AUTH_ENABLED !== 'true') redirect('/clinical/index.html');
  const { data } = await auth.getSession();
  redirect(data?.user ? '/workspace/index.html' : '/sign-in');
}
