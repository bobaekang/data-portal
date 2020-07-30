import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  ReduxIndexButtonBar,
  ReduxIndexBarChart,
  ReduxIndexCounts,
  ReduxIntroduction,
} from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import {
  loadHomepageChartDataFromDatasets,
  loadHomepageChartDataFromGraphQL,
} from './utils';
import { breakpoints, indexPublic } from '../localconf';
import './page.less';

class IndexPageComponent extends React.Component {
  componentDidMount() {
    // If the index page is publicly available, we will attempt to show the
    // homepage charts on the landing page to logged-out users as well as logged-in users.
    // To do this we will need to load data from Peregrine's datasets endpoint, which
    // can be configured to be publicly accessible to logged-out users
    // (with global.public_datasets: true in manifest.json)
    if (indexPublic) {
      loadHomepageChartDataFromDatasets((res) => {
        // If Peregrine returns unauthorized, need to redirect to `/login` page.
        if (res.needLogin) {
          this.props.history.push('/login');
        }
      });
    } else {
      // If homepageChartNodes is not enabled in the config, we will only load
      // the summary data for projects users have access to. We will still show
      // charts on the homepage, but the charts will only contain data from projects
      // the user has access to.
      loadHomepageChartDataFromGraphQL();
    }
  }

  render() {
    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };
    return (
      <div className='index-page'>
        <div className='index-page__top'>
          <div className='index-page__introduction'>
            <ReduxIntroduction
              data={components.index.introduction}
              dictIcons={dictIcons}
            />
            <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
              <ReduxIndexCounts />
            </MediaQuery>
          </div>
          <div className='index-page__bar-chart'>
            <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
              <Slider {...sliderSettings}>
                <div className='index-page__slider-chart'>
                  <ReduxIndexBarChart />
                </div>
              </Slider>
            </MediaQuery>
          </div>
        </div>
        <ReduxIndexButtonBar {...this.props} />
      </div>
    );
  }
}

IndexPageComponent.propTypes = {
  history: PropTypes.object.isRequired,
};

const IndexPage = IndexPageComponent;

export default IndexPage;
