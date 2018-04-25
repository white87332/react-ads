import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import videojs from 'video.js';
import 'videojs-contrib-hls';
import 'video.js/dist/video-js.css';
import { SCContainer, SCAd, SCAdChild, SCAdChildContent, Skip } from './utils/style';

export default class ReactAds extends React.Component
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
            if (nextProps.type === 'video')
            {
                return {
                    type: nextProps.type,
                    url: nextProps.url,
                    adUrl: nextProps.adUrl
                };
            }
            else if (nextProps.type === 'html')
            {
                return {
                    type: nextProps.type,
                    url: '',
                    adUrl: ''
                };
            }
            else
            {
                return null;
            }
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

        if (this.state.adUrl)
        {
            this.startAd();
        }
        else
        {
            this.videoPlayer.play();
        }
    }

    // shouldComponentUpdate(nextProps)
    // {
    //     if (this.props.type === nextProps.type && this.props.url === nextProps.url && nextProps.adUrl === this.props.adUrl)
    //     {
    //         return false;
    //     }
    //     else
    //     {
    //         return true;
    //     }
    // }

    startAd()
    {
        this.countDown = 5;

        this.videoAdPlayer = videojs(this.videoAdRef.current);
        this.videoAdPlayer.src({ src: this.state.adUrl });

        this.videoAdPlayer.on('loadeddata', () => {
            this.videoAdPlayer.play();

            this.videoAdPlayer.on('ended', () => {
                this.skipAd();
            });

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
            adUrl: { $set: '' },
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
        const { type, styles } = this.state;
        let styleAdVideo = (type === 'video') ? { display: 'block' } : { display: 'none' };
        let styleAdHtml = (type === 'html') ? { display: 'block' } : { display: 'none' };

        return (
            <SCContainer>

                <video className="video-js vjs-default-skin" ref={this.videoRef} controls />

                <SCAd show={styles.ad}>
                    <SCAdChild>

                        <SCAdChildContent>

                            {/* ad video */}
                            <video style={styleAdVideo} className="video-js vjs-default-skin" ref={this.videoAdRef} />;

                            {/* ad html */}
                            <div className="html" style={styleAdHtml} dangerouslySetInnerHTML={null} />;

                        </SCAdChildContent>

                        {this.renderCountDown()}

                    </SCAdChild>
                </SCAd>

            </SCContainer>
        );
    }
}
