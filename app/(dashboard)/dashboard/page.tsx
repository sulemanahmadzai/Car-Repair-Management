"use client";

import { Suspense, useState, useEffect } from "react";
import useSWR from "swr";
import {
  Users,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { customerPortalAction } from "@/lib/payments/actions";
import { useActionState } from "react";
import { TeamDataWithMembers, User } from "@/lib/db/schema";
import { removeTeamMember, inviteTeamMember } from "@/app/(login)/actions";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SubscriptionSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
    </Card>
  );
}

function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                Current Plan: {teamData?.planName || "Free"}
              </p>
              <p className="text-sm text-muted-foreground">
                {teamData?.subscriptionStatus === "active"
                  ? "Billed monthly"
                  : teamData?.subscriptionStatus === "trialing"
                  ? "Trial period"
                  : "No active subscription"}
              </p>
            </div>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline">
                Manage Subscription
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembersSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4 mt-1">
          <div className="flex items-center space-x-4">
            <div className="size-8 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-14 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
    return user.name || user.email || "Unknown User";
  };

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team members yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {/* 
                    This app doesn't save profile images, but here
                    is how you'd show them:

                    <AvatarImage
                      src={member.user.image || ''}
                      alt={getUserDisplayName(member.user)}
                    />
                  */}
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {getUserDisplayName(member.user)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member.role}
                  </p>
                </div>
              </div>
              {index > 1 ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isRemovePending}
                  >
                    {isRemovePending ? "Removing..." : "Remove"}
                  </Button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {removeState?.error && (
          <p className="text-red-500 mt-4">{removeState.error}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMemberSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
    </Card>
  );
}

function InviteTeamMember() {
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const isOwner = user?.role === "owner";
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
              disabled={!isOwner}
            />
          </div>
          <div>
            <Label>Role</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-red-500">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-green-500">{inviteState.success}</p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const [isLoading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate loading time like the main project
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by showing loading state during SSR
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your modern dashboard
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your modern dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$48,569"
          subtitle="Last month"
          icon={DollarSign}
          color="primary"
          trend={{ value: "+12.5%", isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Customers"
          value="1,256"
          subtitle="Active users"
          icon={Users}
          color="secondary"
          trend={{ value: "+8.2%", isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Orders"
          value="389"
          subtitle="This month"
          icon={ShoppingCart}
          color="success"
          trend={{ value: "+24.1%", isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Conversion Rate"
          value="3.2%"
          subtitle="vs last month"
          icon={TrendingUp}
          color="warning"
          trend={{ value: "-2.4%", isPositive: false }}
          isLoading={isLoading}
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Updates */}
        <DashboardCard
          title="Revenue Updates"
          subtitle="Overview of latest month"
          className="lg:col-span-2"
          isLoading={isLoading}
        >
          <div className="h-64 flex items-center justify-center bg-[hsl(var(--grey-100))] rounded-lg">
            <p className="text-muted-foreground">Chart Placeholder</p>
          </div>
        </DashboardCard>

        {/* Yearly Breakup */}
        <DashboardCard
          title="Yearly Breakup"
          subtitle="Total revenue"
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">$36,358</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center text-sm text-[hsl(var(--success))]">
                    <ArrowUpRight className="w-4 h-4" />
                    +9%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    last year
                  </span>
                </div>
              </div>
              <div className="w-24 h-24 bg-[hsl(var(--primary-light))] rounded-full"></div>
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--primary))]"></div>
                  <span className="text-muted-foreground">2024</span>
                </div>
                <span className="font-medium">$25,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--secondary))]"></div>
                  <span className="text-muted-foreground">2023</span>
                </div>
                <span className="font-medium">$11,358</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Monthly Earnings */}
        <DashboardCard
          title="Monthly Earnings"
          subtitle="Total monthly profit"
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">$6,820</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center text-sm text-[hsl(var(--error))]">
                    <ArrowDownRight className="w-4 h-4" />
                    -9%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    last month
                  </span>
                </div>
              </div>
            </div>
            <div className="h-24 bg-[hsl(var(--grey-100))] rounded-lg flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Chart Area</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Team Settings Section */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Team Settings
        </h2>
        <div className="space-y-6">
          <Suspense fallback={<SubscriptionSkeleton />}>
            <ManageSubscription />
          </Suspense>
          <Suspense fallback={<TeamMembersSkeleton />}>
            <TeamMembers />
          </Suspense>
          <Suspense fallback={<InviteTeamMemberSkeleton />}>
            <InviteTeamMember />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
