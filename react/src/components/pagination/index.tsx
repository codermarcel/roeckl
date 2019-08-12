import React from 'react'
import { Pagination } from 'semantic-ui-react'

import store from "../../stores/products"
import { observer } from 'mobx-react';

@observer
class PaginationComponent extends React.Component {
  render() {
    let totalPages = store.page
    if (store.hasMore) {
      totalPages += 1
    }
    return (
      <Pagination
        onPageChange={(e, second) => store.setPage(Number(second.activePage))}
        activePage={store.page}
        boundaryRange={1}
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={0}
        totalPages={totalPages}
      />
    );
  }
}

export default PaginationComponent