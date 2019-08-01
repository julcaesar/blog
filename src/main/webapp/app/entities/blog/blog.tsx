import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './blog.reducer';
import { IBlog } from 'app/shared/model/blog.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBlogProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Blog extends React.Component<IBlogProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { blogList, match } = this.props;
    return (
      <div>
        <h2 id="blog-heading">
          Blogs
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Blog
          </Link>
        </h2>
        <div className="table-responsive">
          {blogList && blogList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Handle</th>
                  <th>User</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {blogList.map((blog, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${blog.id}`} color="link" size="sm">
                        {blog.id}
                      </Button>
                    </td>
                    <td>{blog.name}</td>
                    <td>{blog.handle}</td>
                    <td>{blog.user ? blog.user.login : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${blog.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${blog.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${blog.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Blogs found</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ blog }: IRootState) => ({
  blogList: blog.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog);
