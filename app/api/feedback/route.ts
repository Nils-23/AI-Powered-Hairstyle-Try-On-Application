import { NextResponse } from 'next/server'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

const app = initializeApp({
  credential: cert(serviceAccount)
})
const db = getFirestore(app)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    await db.collection('feedback').add(data)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
} 