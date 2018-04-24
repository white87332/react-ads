import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import videojs from 'video.js';
import 'videojs-contrib-hls';
import 'video.js/dist/video-js.css';
import { SCContainer, SCAd, SCAdChild, SCAdChildContent, Skip } from './utils/style';

class ReactAds extends React.Component
{
    static propTypes = {
        type: PropTypes.string,
        url: PropTypes.string,
        skipTime: PropTypes.number,
        adUrl: PropTypes.string
    }

    static defaultProps = {
        type: 'video',
        url: 'http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8',
        skipTime: 5,
        adUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }

    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (prevState.type !== nextProps.type || prevState.url !== nextProps.url || nextProps.adUrl !== prevState.adUrl)
        {
            return {
                type: nextProps.type,
                url: nextProps.url,
                adUrl: nextProps.adUrl
            };
        }
        else
        {
            return null;
        }
    }

    constructor(props, context)
    {
        super(props, context);

        const {
            type, url, adUrl, skipTime
        } = this.props;

        this.state = {
            type,
            url,
            adUrl,
            styles: {
                ad: 'ad',
                skip: 'skip'
            },
            countDown: skipTime
        };

        this.videoRef = React.createRef();
        this.videoAdRef = React.createRef();
        this.skipAd = this.skipAd.bind(this);
    }

    componentDidMount()
    {
        this.videoPlayer = videojs(this.videoRef.current);
        this.videoPlayer.src({ src: this.state.url });
        this.videoPlayer.play();

        if (this.state.adUrl)
        {
            setTimeout(() => {
                this.startAd();
            }, 2000);
        }
    }

    startAd()
    {
        this.countDown = 5;

        this.videoAdPlayer = videojs(this.videoAdRef.current);
        this.videoAdPlayer.src({ src: this.state.adUrl });

        this.videoAdPlayer.on('loadeddata', () => {
            this.videoAdPlayer.play();

            this.id = setInterval(() => {
                this.countDown -= 1;
                this.setState(update(this.state, {
                    countDown: { $set: this.countDown },
                    styles: {
                        ad: { $set: 'ad show' },
                        skip: { $set: (this.countDown === 0) ? 'skip active' : 'skip' }
                    }
                }), () => {
                    if (!this.videoPlayer.paused())
                    {
                        this.videoPlayer.pause();
                    }
                });
            }, 1000);
        });
    }

    skipAd()
    {
        this.videoAdPlayer.dispose();

        this.setState(update(this.state, {
            type: { $set: '' },
            // adUrl: { $set: '' },
            styles: {
                ad: { $set: 'ad' },
                skip: { $set: 'skip' },
            }
        }), () => {
            clearInterval(this.id);
            this.videoPlayer.play();
        });
    }

    renderCountDown()
    {
        const { styles, countDown } = this.state;
        if (this.countDown === 0)
        {
            clearInterval(this.id);
            return <Skip onClick={this.skipAd} skip={styles.skip}>Skip this ad</Skip>;
        }
        else
        {
            return <Skip skip={styles.skip}>Skip this ad in {countDown} seconds</Skip>;
        }
    }

    render()
    {
        let styleAdVideo = {
            style: {
                display: 'none'
            }
        };

        let styleadHtml = {
            style: {
                display: 'none'
            }
        };

        switch (this.state.type)
        {
            case 'video':
                styleAdVideo = {
                    style: {
                        display: 'block'
                    }
                };
                break;

            case 'html':
                styleadHtml = {
                    style: {
                        display: 'block'
                    }
                };
                break;
            default:
        }

        return (
            <SCContainer>

                <video className="video-js vjs-default-skin" ref={this.videoRef} autoPlay controls />

                <SCAd show={this.state.styles.ad}>
                    <SCAdChild>

                        <SCAdChildContent>

                            {/* ad video */}
                            <video style={styleAdVideo} className="video-js vjs-default-skin" ref={this.videoAdRef} autoPlay />;

                            {/* ad html */}
                            <div style={styleadHtml} dangerouslySetInnerHTML={null} />;

                        </SCAdChildContent>

                        {this.renderCountDown()}

                    </SCAdChild>
                </SCAd>

            </SCContainer>
        );
    }
}

export default ReactAds;
