import './Loading.css';

function Loading() {
    return (
        <div className='loading-overlay' role='status' aria-label='Loading'>
            <div className='loading-dots'>
                <span className='loading-dot'></span>
                <span className='loading-dot'></span>
                <span className='loading-dot'></span>
            </div>
        </div>
    );
}

export default Loading;
