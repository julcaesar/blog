import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './blog-entry.reducer';
import { IBlogEntry } from 'app/shared/model/blog-entry.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBlogEntryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class BlogEntryDetail extends React.Component<IBlogEntryDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { blogEntryEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            BlogEntry [<b>{blogEntryEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">Title</span>
            </dt>
            <dd>{blogEntryEntity.title}</dd>
            <dt>
              <span id="content">Content</span>
            </dt>
            <dd>{blogEntryEntity.content}</dd>
            <dt>
              <span id="date">Date</span>
            </dt>
            <dd>
              <TextFormat value={blogEntryEntity.date} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>Blog</dt>
            <dd>{blogEntryEntity.blog ? blogEntryEntity.blog.name : ''}</dd>
            <dt>Tag</dt>
            <dd>
              {blogEntryEntity.tags
                ? blogEntryEntity.tags.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.name}</a>
                      {i === blogEntryEntity.tags.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/blog-entry" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/blog-entry/${blogEntryEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ blogEntry }: IRootState) => ({
  blogEntryEntity: blogEntry.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogEntryDetail);
