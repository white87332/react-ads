import styled from 'styled-components';

export const SCContainer = styled.div`
    position: relative;
    top: 0;
    left: 0;

    width: 100%;
    height: 500px;

    background-color: rgba(255,255,255,.5);

    .video-js
    {
        width: 100%;
        height: 100%;

         > video
        {
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;

            width: 100%;
            height: 100%;
        }
    }
`;

export const SCAd = styled.div`
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, .5);

    display: ${(props) => { return props.show.indexOf('show') !== -1 ? 'block' : 'none'; }};
`;

export const SCAdChild = styled.div`
    position: relative;

    width: 100%;
    height: 100%;
`;

export const SCAdChildContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    align-items: center;

    width: 100%;
    height: 100%;

    > video
    {
        width: 100%;
        height: 100%;
    }
`;

export const Skip = styled.div`
    font-style: italic;
    line-height: 12px;

    position: absolute;
    right: 2%;
    bottom: 5%;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 220px;
    height: 50px;
    padding: 10px;

    pointer-events: none;

    color: #aaa;
    background-color: #000;

    cursor: ${(props) => { return props.skip === 'skip active' ? 'pointer' : 'default'; }};
    pointer-events: ${(props) => { return props.skip === 'skip active' ? 'all' : 'none'; }};
`;
