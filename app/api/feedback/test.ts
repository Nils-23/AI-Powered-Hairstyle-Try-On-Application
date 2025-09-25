import { NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) })
}
const db = getFirestore()

export async function GET() {
  try {
    // Try to write a test document
    const ref = await db.collection('feedback').add({
      test: true,
      timestamp: Date.now()
    })
    return NextResponse.json({ success: true, id: ref.id })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}