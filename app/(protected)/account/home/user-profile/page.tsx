'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { PersonalInfo } from '@/app/(protected)/account/home/user-profile/content';
import { PageNavbar } from '@/app/(protected)/account/page-navbar';

export default function AccountUserProfilePage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      <Container>
        <PersonalInfo />
      </Container>
    </Fragment>
  );
}
