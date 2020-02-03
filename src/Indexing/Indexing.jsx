import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import copy from 'clipboard-plus';
import Button from '@gen3/ui-component/dist/components/Button';
import { jsonToString } from '../utils';
import { indexdPath, userapiPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import KeyTable from '../components/tables/KeyTable';
import { showArboristAuthzOnProfile, showFenceAuthzOnProfile } from '../configs';
import './Indexing.less';

export const saveToFile = (savingStr, filename) => {
  const blob = new Blob([savingStr], { type: 'text/json' });
  FileSaver.saveAs(blob, filename);
};

class Indexing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploadedFile: null,
      indexFilesButtonEnabled: false,
    };
  }
  
  onFormSubmit = (e) => {
      e.preventDefault() // Stop form submit
      this.fileUpload(this.state.uploadedFile).then((response)=>{
        console.log(response.data);
      })
  }

  savePopupClose = () => {
    onUpdatePopup({ saveTokenPopup: false });
    onClearCreationSession();
  };

  createPopupClose = () => {
    onClearDeleteSession();
    onUpdatePopup({ deleteTokenPopup: false });
  };

  onChange = (e) => {
    this.setState({uploadedFile:e.target.files[0], indexFilesButtonEnabled: true});
  };

  submitToServer = () => {
    console.log('posting to ', userapiPath + 'data/upload');
    var _this = this;
    return fetchWithCreds({
      path: userapiPath + 'data/upload',
      method: 'POST',
      // customHeaders: { 'Content-Type': submission.file_type },
      body: JSON.stringify({
        "file_name": this.state.uploadedFile.name,
        "expires_in": 1200
      }),
      // dispatch,
    }).then(function(response) {
      console.log(response);
      _this.setState({indexFilesButtonEnabled: true});
    });
  };

  fileUpload = (file) => {
    const url = 'http://example.com/file-upload';
    const formData = new FormData();
    formData.append('file', file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    // return post(url, formData,config)
  }

  indexFiles = () => {
    this.setState({indexFilesButtonEnabled: false});
    console.log(this.state.uploadedFile);
    console.log('zoopt up');
    this.submitToServer();
  };

  download = () => {
    console.log('woosah');
  };

  render = () => {
    return (
      <div className='indexing-page'>
          <div>
            <div className='action-panel'>
              <div className='action-panel-title'>
                Index Data Files
              </div>
              <div className='action-panel-body'>
                <p>An indexing file, or file manifest, is a TSV containing information about
                files that exist in cloud storage. Rows of importance include the MD5 sum of the file,
                a link to the file, the filename, and its size.</p>

                <p>Upload an indexing file below to create records in indexd for new object files.</p>
                <form onSubmit={this.onFormSubmit}>
                  <input type="file" onChange={this.onChange} />
                </form>
              </div>
              <div className='action-panel-footer'>
                  <Button
                    // key={buttonConfig.type}
                    onClick={this.indexFiles}
                    label='Index Files'
                    // leftIcon={buttonConfig.leftIcon}
                    rightIcon="upload"
                    className='g3-button'
                    buttonType='primary'
                    enabled={ this.state.indexFilesButtonEnabled }
                    // tooltipEnabled={buttonConfig.tooltipText ? !this.isButtonEnabled(buttonConfig) : false}
                    // tooltipText={btnTooltipText}
                    // isPending={this.isButtonPending(buttonConfig)}
                  />
              </div>
            </div>
            <div className='action-panel'>
              <div className='action-panel-title'>
                Download Indexing File
              </div>
              <div className='action-panel-body'>
                Clicking the download button below will generate and return a TSV containing
                the information related to all file records in indexd. Columns returned include 
                GUID, cloud storage URLs, filename, file size, and MD5 hash.
              </div>
              <div className='action-panel-footer'>
                  <Button
                    // key={buttonConfig.type}
                    onClick={this.download}
                    label='Download'
                    // leftIcon={buttonConfig.leftIcon}
                    rightIcon="download"
                    className='g3-button'
                    buttonType='primary'
                    // enabled={this.isButtonEnabled(buttonConfig)}
                    // tooltipEnabled={buttonConfig.tooltipText ? !this.isButtonEnabled(buttonConfig) : false}
                    // tooltipText={btnTooltipText}
                    // isPending={this.isButtonPending(buttonConfig)}
                  />
              </div>
            </div>
          </div>
      </div>
    );
  }
};

Indexing.propTypes = {
  user: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  popups: PropTypes.object.isRequired,
  submission: PropTypes.object,
  onClearCreationSession: PropTypes.func.isRequired,
  onCreateKey: PropTypes.func.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onDeleteKey: PropTypes.func.isRequired,
  onRequestDeleteKey: PropTypes.func.isRequired,
  onClearDeleteSession: PropTypes.func.isRequired,
};

Indexing.defaultProps = {
  submission: {},
};

export default Indexing;
