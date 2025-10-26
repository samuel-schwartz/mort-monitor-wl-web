import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <UserX className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Client Not Found</CardTitle>
          <CardDescription>The client you're looking for doesn't exist or you don't have access to it</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/broker">Back to Clients</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
