// src/components/dashboard/StatCards.jsx
import React from 'react';
import { Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { statCards } from '../../share';

const StatCards = () => {
  return (
    <Row gutter={[16, 16]} className="stat-cards-row">
      {statCards.map((card) => (
        <Col xs={24} sm={12} xl={6} key={card.key}>
          <div className="stat-card">
            <div className={`stat-card__icon ${card.iconClass}`}>
              <span>{card.icon}</span>
            </div>
            <div className="stat-card__body">
              <div className="stat-card__label">{card.label}</div>
              <div className="stat-card__value">{card.value}</div>
              <div className="stat-card__footer">
                <span
                  className={`stat-card__trend stat-card__trend--${card.trendDir}`}
                >
                  {card.trendDir === 'up' ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                  {card.trend}
                </span>
                <span>{card.trendNote}</span>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default StatCards;