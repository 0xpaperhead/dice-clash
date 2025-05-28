import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers'; // Import headers to read them

export async function GET(request: NextRequest) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const linkedAccountsHeader = headersList.get('x-user-linked-accounts');

  if (!userId) {
    // This case should ideally be caught by middleware, 
    // but good to have a fallback or for direct testing without middleware.
    console.error('API verify-user: x-user-id header not found. Middleware might not have run or failed.');
    return NextResponse.json({ message: 'Authentication information not found in headers' }, { status: 401 });
  }

  let linkedAccounts = null;
  if (linkedAccountsHeader) {
    try {
      linkedAccounts = JSON.parse(linkedAccountsHeader);
    } catch (error) {
      console.error('API verify-user: Failed to parse x-user-linked-accounts header:', error);
      // Decide how to handle: proceed without linkedAccounts, or return an error
      // For now, we'll just log and proceed without them if parsing fails
    }
  }

  // You now have the userId and potentially linkedAccounts passed by the middleware
  return NextResponse.json({
    message: 'User verified successfully via middleware',
    userId: userId,
    linkedAccounts: linkedAccounts,
    // You can add any other logic here that requires the userId
  });
} 