'use client';
import { supabase } from '@/lib/supabaseClient'; // Your Supabase client
import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode 
} from 'react';
import { Session, User } from '@supabase/supabase-js';

// --- TypeScript ---
// 1. Define the shape of the context value
interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

// --- TypeScript ---
// 2. Create the Context with the defined type, defaulting to null
const AuthContext = createContext<AuthContextType | null>(null);

// --- TypeScript ---
// 3. Define the props for the provider
interface AuthProviderProps {
    children: ReactNode;
}

// 4. Create the Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
    // --- TypeScript ---
    // Type the state variables
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch the initial session
        async function getInitialSession() {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        }

        getInitialSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: string, session: Session | null) => {
                setSession(session);
            }
        );

        // Unsubscribe from the listener when the component unmounts
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Helper function for Google Sign-In
    const signInWithGoogle = async (): Promise<void> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/instruments`,
            },
        });
        if (error) {
            console.error('Sign in error:', error.message);
        }
    };

    // Helper function for Sign-Out
    const signOut = async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign out error:', error.message);
        }
    };

    // --- TypeScript ---
    // 5. Create the value object, ensuring it matches AuthContextType
    const value: AuthContextType = {
        session,
        user: session?.user ?? null,
        loading,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Only render children when initial session is loaded */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

// --- TypeScript ---
// 6. Create the `useAuth` hook, which returns the non-null context type
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    
    // Check if the hook is used outside of an AuthProvider
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};