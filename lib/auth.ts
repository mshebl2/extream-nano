import { cookies } from 'next/headers';

// Simple session check - no JWT needed
export async function getSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        // Just check if the cookie exists and has the correct value
        if (token === 'authenticated') {
            return { authenticated: true };
        }
        return null;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('admin_token');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}
