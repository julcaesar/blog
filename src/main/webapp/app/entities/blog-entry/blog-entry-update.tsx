import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IBlog } from 'app/shared/model/blog.model';
import { getEntities as getBlogs } from 'app/entities/blog/blog.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './blog-entry.reducer';
import { IBlogEntry } from 'app/shared/model/blog-entry.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IBlogEntryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IBlogEntryUpdateState {
  isNew: boolean;
  idstag: any[];
  blogId: string;
}

export class BlogEntryUpdate extends React.Component<IBlogEntryUpdateProps, IBlogEntryUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idstag: [],
      blogId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (!this.state.isNew) {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getBlogs();
    this.props.getTags();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    values.date = convertDateTimeToServer(values.date);

    if (errors.length === 0) {
      const { blogEntryEntity } = this.props;
      const entity = {
        ...blogEntryEntity,
        ...values,
        tags: mapIdList(values.tags)
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/blog-entry');
  };

  render() {
    const { blogEntryEntity, blogs, tags, loading, updating } = this.props;
    const { isNew } = this.state;

    const { content } = blogEntryEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="blogApp.blogEntry.home.createOrEditLabel">Create or edit a BlogEntry</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : blogEntryEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="blog-entry-id">ID</Label>
                    <AvInput id="blog-entry-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="blog-entry-title">
                    Title
                  </Label>
                  <AvField
                    id="blog-entry-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="contentLabel" for="blog-entry-content">
                    Content
                  </Label>
                  <AvInput
                    id="blog-entry-content"
                    type="textarea"
                    name="content"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="dateLabel" for="blog-entry-date">
                    Date
                  </Label>
                  <AvInput
                    id="blog-entry-date"
                    type="datetime-local"
                    className="form-control"
                    name="date"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.blogEntryEntity.date)}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="blog-entry-blog">Blog</Label>
                  <AvInput id="blog-entry-blog" type="select" className="form-control" name="blog.id">
                    <option value="" key="0" />
                    {blogs
                      ? blogs.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="blog-entry-tag">Tag</Label>
                  <AvInput
                    id="blog-entry-tag"
                    type="select"
                    multiple
                    className="form-control"
                    name="tags"
                    value={blogEntryEntity.tags && blogEntryEntity.tags.map(e => e.id)}
                  >
                    <option value="" key="0" />
                    {tags
                      ? tags.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/blog-entry" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  blogs: storeState.blog.entities,
  tags: storeState.tag.entities,
  blogEntryEntity: storeState.blogEntry.entity,
  loading: storeState.blogEntry.loading,
  updating: storeState.blogEntry.updating,
  updateSuccess: storeState.blogEntry.updateSuccess
});

const mapDispatchToProps = {
  getBlogs,
  getTags,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogEntryUpdate);
