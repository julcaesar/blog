import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BlogEntry from './blog-entry';
import BlogEntryDetail from './blog-entry-detail';
import BlogEntryUpdate from './blog-entry-update';
import BlogEntryDeleteDialog from './blog-entry-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BlogEntryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BlogEntryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BlogEntryDetail} />
      <ErrorBoundaryRoute path={match.url} component={BlogEntry} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={BlogEntryDeleteDialog} />
  </>
);

export default Routes;
