import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, role, school, name } = await request.json()

        // We need the SERVICE_ROLE_KEY to create users without logging in
        // and to send the invite email.
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // 1. Invite the user via Supabase Auth
        // This sends an email to the user with a link to set their password
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: {
                role,
                school,
                name
            },
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
        })

        if (authError) {
            // Handle case where user already exists in Auth but maybe not in public.users
            if (authError.message.includes('already been registered')) {
                // 1. Find the user ID
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
                const existingUser = users.find(u => u.email === email)

                if (existingUser) {
                    // 2. Update public.users (Restore/Update)
                    const { error: dbError } = await supabaseAdmin
                        .from('users')
                        .upsert({
                            id: existingUser.id,
                            email: email,
                            name: name,
                            role: role,
                            school: school,
                            password: 'MANAGED_BY_SUPABASE_AUTH'
                        })

                    if (dbError) {
                        console.error('Error syncing existing user:', dbError)
                        return NextResponse.json({ error: 'Failed to update existing user record' }, { status: 500 })
                    }

                    // 3. Send Password Reset email (acting as re-invite)
                    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
                        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
                    })

                    if (resetError) {
                        return NextResponse.json({ error: 'User exists but failed to send reset email: ' + resetError.message }, { status: 400 })
                    }

                    return NextResponse.json({ success: true, message: "User already existed. Re-linked and sent password reset email." })
                }
            }

            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        // 2. The user is now in auth.users. 
        // We rely on a Database Trigger (which we will set up) to copy them to public.users
        // OR we can manually insert them here if we want to be sure.

        // Let's manually insert/update to public.users to be safe and immediate
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: authData.user.id, // Link the IDs
                email: email,
                name: name,
                role: role,
                school: school,
                password: 'MANAGED_BY_SUPABASE_AUTH' // Placeholder
            })

        if (dbError) {
            console.error('Error syncing to public users:', dbError)
            // Don't fail the request, the invite was sent
        }

        return NextResponse.json({ success: true, user: authData.user })

    } catch (error: any) {
        console.error('Invite error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
