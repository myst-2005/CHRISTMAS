'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Lock } from 'lucide-react'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            // Also update our public users table to remove the 'PENDING_SETUP' flag
            // (Optional, as auth is handled by Supabase, but good for record keeping)
            const { data: { user } } = await supabase.auth.getUser()
            if (user && user.email) {
                await supabase.from('users').update({ password: 'SECURE_HASH' }).eq('email', user.email)
            }

            alert('Password updated successfully! You can now login.')
            router.push('/')
        } catch (error: any) {
            alert('Error updating password: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)'
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'white'
                    }}>
                        <Lock size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Set New Password</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Please create a secure password for your account.</p>
                </div>

                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>New Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
