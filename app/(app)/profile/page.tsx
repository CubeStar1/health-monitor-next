"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/use-user";
import UserProfile from "@/components/supaauth/user-profile";

export default function ProfilePage() {

	const { data } = useUser();
	const [email, setEmail] = useState(data?.email);

  return (
    <div className="max-w-2xl mx-auto p-6">

		<div className="flex w-full flex-row justify-between py-4 mb-6">
				<h1 className="text-3xl font-bold">Profile</h1>
				<UserProfile />
		</div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email address</label>
              <Input id="email" type="email" value={email} placeholder={data?.email} />
            </div>
            <Button variant="secondary" onClick={() => setEmail(data?.email)}>Update email</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}