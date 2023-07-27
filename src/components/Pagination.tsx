export const BottomPageSet = () => {
    return (
        <div className="center">
            <div className="pagination">
                <a href="#" onClick={e => { e.preventDefault(); setPageNum(1); setPageNumRefresh(1); }}>&laquo;</a>
                {
                    Array.from(Array(totalPage), (e, i) => {
                        return (<a href="#" className={pageNum == (i + 1) ? "active" : ""} key={i + 1}
                            onClick={e => { e.preventDefault(); setPageNum(i + 1); setPageNumRefresh(i + 1); }}>
                            {i + 1}
                        </a>)
                    })
                }
                <a href="#" onClick={e => { e.preventDefault(); setPageNum(totalPage); setPageNumRefresh(totalPage); }}>&raquo;</a>
            </div>
        </div>
    )
}