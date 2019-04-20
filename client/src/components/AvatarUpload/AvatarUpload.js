import React from 'react';
import { Mutation } from 'react-apollo';
import { Image, Transformation } from 'cloudinary-react';

import withStyles from '@material-ui/core/styles/withStyles';

import avatar from 'assets/img/avatar.jpg';

import CREATE_AVATAR from 'graphql/mutations/CreateAvatar';

const styles = {
  img: {
    width: '75px',
    height: '75px',
    borderRadius: '50%',
  },
};

const AvatarUpload = ({ classes, onChange }) => {
  return (
    <div>
      <Mutation mutation={CREATE_AVATAR}>
        {(createAvatar, { data, loading, error }) => (
          <div>
            {data && data.createAvatar && data.createAvatar.publicId ? (
              <Image publicId={data.createAvatar.publicId} className={classes.img}>
                <Transformation width="75" height="75" gravity="faces" crop="fill" />
              </Image>
            ) : (
              <img src={avatar} alt="Foto de perfil" className={classes.img} />
            )}

            <input
              type="file"
              // required
              onChange={async ({
                target: {
                  validity,
                  files: [file],
                },
              }) => {
                if (validity.valid) {
                  const response = await createAvatar({ variables: { file } });
                  if (onChange && response && response.data) {
                    onChange(response.data.createAvatar);
                  }
                }
              }}
            />
          </div>
        )}
      </Mutation>
    </div>
  );
};

export default withStyles(styles)(AvatarUpload);
