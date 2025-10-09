'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PersonalInfo } from '@/app/(protected)/user-profile/content';

export default function AccountUserProfilePage() {
  return (
    <Fragment>
      <Container>
        <PersonalInfo />
      </Container>
    </Fragment>
  );
}
