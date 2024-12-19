import React, { Component } from "react";
import PropTypes from "prop-types";
import { Responsive, WidthProvider } from "react-grid-layout";
import { connect } from "react-redux";

import GridItemContainer from "../containers/GridItemContainer";

import { setBreakPoint } from "../actions/app-actions";

const ResponsiveGridLayout = WidthProvider(Responsive);

class GridLayout extends Component {
  handleBreakPointChange = (breakpoint) => {
    this.breakpoint = breakpoint;
    this.props.setBreakPoint(breakpoint);
  };

  handleLayoutChange = (newLayout) => {
    console.log("newLayout", newLayout);
    console.log("layouts", this.props);
    console.log("breakpoint", this.breakpoint);
    this.props.layouts[TouchList.breakpoint] = newLayout;
  };

  render() {
    const { data, layouts } = this.props;
    return (
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onBreakpointChange={this.handleBreakPointChange}
        onLayoutChange={this.handleLayoutChange}
        isDraggable
        isRearrangeable
        isResizable
        draggableHandle=".grid-item__title"
        breakpoints={{ lg: 1280, md: 992, sm: 767, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {data.map((item) => (
          <GridItemContainer key={item} item={item} />
        ))}
      </ResponsiveGridLayout>
    );
  }
}

GridLayout.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  layouts: PropTypes.object.isRequired
};

export default connect(null, { setBreakPoint })(GridLayout);
