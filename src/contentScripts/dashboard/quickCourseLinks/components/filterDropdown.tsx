import type { Filter } from "../filter.ts";

export type FilterDropdownProps = {
  options: Filter[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const FilterDropdown = (
  props: FilterDropdownProps,
) => {
  const { options, filter, setFilter } = props;

  return (
    <div
      data-region="filter"
      className="d-flex align-items-center my-2"
      aria-label="コースリンクコントロール"
    >
      <div className="dropdown mb-1 mr-auto">
        <button
          type="button"
          className="btn btn-outline-secondary dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="グルーピングドロップダウンメニュ"
        >
          <span data-active-item-text>
            {filter.label}
          </span>
        </button>
        <ul
          className="dropdown-menu"
          role="menu"
          data-show-active-item
          data-skip-active-class="true"
          data-active-item-text
          aria-labelledby="groupingdropwodn"
        >
          <li className="dropdown-divider" role="presentation">
            <span className="filler">&nbsp;</span>
          </li>
          {options.map((item) => (
            <li key={item.label}>
              <a
                href="javascript:void(0)"
                className="dropdown-item"
                data-filter="grouping"
                aria-current={item === filter}
                onClick={() => setFilter(item)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
