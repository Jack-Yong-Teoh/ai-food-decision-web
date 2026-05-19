"use client";
import '../../styles/recommend/recommend.scss';

import React, { useState } from "react";
import { Button, Form, Image,Input, Select, Space } from "antd";
import { FileTextOutlined, FireOutlined, SettingOutlined,UnorderedListOutlined } from "@ant-design/icons";

import LayoutSection from "../_components/layout/LayoutSection";

const { TextArea } = Input;

const cuisineOptions = [
  { value: 'any', label: 'Any' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'indian', label: 'Indian' },
  { value: 'thai', label: 'Thai' },
  { value: 'american', label: 'American' },
  { value: 'korean', label: 'Korean' },
  { value: 'french', label: 'French' },
];

const mealOptions = [
  { value: 'any', label: 'Any' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'dessert', label: 'Dessert' },
];

const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Keto',
  'Halal',
  'Kosher',
];

const moodOptions = [
  { value: 'any', label: 'Any' },
  { value: 'comfort food', label: 'Comfort Food' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'fancy', label: 'Fancy' },
  { value: 'light', label: 'Light' },
  { value: 'quick & easy', label: 'Quick & Easy' },
  { value: 'adventurous', label: 'Adventurous' },
];

interface RecommendationResult {
  name: string;
  cuisine: string;
  calories: number;
  description: string;
  ingredients: string[];
  imageUrl: string;
  notes: string;
}

const RecommendPage: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedDietary, setSelectedDietary] = useState<string[]>(["None"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [submittedValues, setSubmittedValues] = useState<any>({});
  const [notesInput, setNotesInput] = useState<string>("");

  const handleDietaryClick = (value: string) => {
    setSelectedDietary((prev) => {
      // If clicking "None"
      if (value === "None") {
        return ["None"];
      }

      // If clicking a non-None option while "None" is selected
      if (prev.includes("None")) {
        return [value];
      }

      // If clicking an already selected non-None option, deselect it
      if (prev.includes(value)) {
        const newSelection = prev.filter((item) => item !== value);
        // If nothing left, default to "None"
        return newSelection.length > 0 ? newSelection : ["None"];
      }

      // Otherwise, add the new option
      return [...prev, value];
    });
  };

  const handleGenerate = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      // 获取最新的表单值
      const currentValues = form.getFieldsValue();
      currentValues.notes = notesInput;
      setSubmittedValues(currentValues);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock result - in real app this would come from API
      const mockResult: RecommendationResult = {
        name: "Margherita Pizza",
        cuisine: currentValues.cuisine+" cuisine" || 'any',
        calories: 520,
        description:
          "Classic Italian pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust.",
        ingredients: [
          "Pizza dough",
          "Mozzarella",
          "Tomatoes",
          "Basil",
          "Olive oil",
        ],
        imageUrl:
          "../../assets/project/food-genie-logo.png",
        notes: notesInput || '',
      };

      setResult(mockResult);
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutSection>
      <Space direction="vertical" size="middle" className="recommend-header">
        <div className="recommend-title">What Should You Eat Today?</div>
        <div className="recommend-subtitle">
          Tell us your preferences and let AI recommend the perfect meal for
          you!
        </div>
      </Space>

      <div className="recommend-form-card">
        <Form form={form} layout="vertical" className="recommend-form" >
          {/* Cuisine Type */}
          <Form.Item className="form-item" name="cuisine" initialValue="any"
            label={<div className="form-label">Cuisine Type</div>}
          >
            <Select 
              options={cuisineOptions} 
              className="recommend-select"
              classNames={{ popup: { root: "recommend-select-dropdown" } }}
              defaultValue="any"
            />
          </Form.Item>

          {/* Meal Type */}
          <Form.Item className="form-item" name="meal" initialValue="any"
            label={<div className="form-label">Meal Type</div>}
          >
            <Select 
              options={mealOptions} 
              className="recommend-select"
              classNames={{ popup: { root: "recommend-select-dropdown" } }}
              defaultValue="any"
            />
          </Form.Item>

          {/* Dietary Restrictions */}
          <Form.Item className="form-item">
            <div className="form-label">Dietary Restrictions</div>
            <div className="dietary-tags">
              {dietaryOptions.map((option) => (
                <div
                  key={option}
                  className={`dietary-tag ${
                    selectedDietary.includes(option) ? "dietary-tag--active" : ""
                  }`}
                  onClick={() => handleDietaryClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </Form.Item>

          {/* Style Type */}
          <Form.Item className="form-item" name="mood" initialValue="any"
            label={<div className="form-label">Style Type</div>}
          >
            <Select 
              options={moodOptions} 
              className="recommend-select"
              classNames={{ popup: { root: "recommend-select-dropdown" } }}
              defaultValue="any"
            />
          </Form.Item>

          {/* Additional Notes */}
          <Form.Item className="form-item" name="notes"
            label={<div className="form-label">Additional Notes</div>}
          >
            <TextArea
              placeholder="Any specific preferences, allergies, or ingredients you'd like to include/avoid..."
              rows={4}
              className="recommend-textarea"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
            />
            <div className="form-hint">
              Example: &quot;No seafood&quot;, &quot;Extra spicy&quot;, &quot;Low
              carb options&quot;
            </div>
          </Form.Item>

          {/* Generate Button */}
          <Button
            type="primary"
            className="generate-button"
            onClick={handleGenerate}
            loading={loading}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/>
              <path d="M19 17v4"/>
              <path d="M3 5h4"/>
              <path d="M17 19h4"/>
            </svg>
            Generate Recommendation (1 Token)
          </Button>
        </Form>
      </div>

      {/* Result Card */}
      {result && (
        <div className="result-card">
          <div className="result-image-wrapper">
            <Image
              src={result.imageUrl}
              alt={result.name}
              className="result-image"
              preview={false}
              fallback="/assets/food-fallback.webp"
            />
            <div className="result-image-overlay">
              <div className="result-name">{result.name}</div>
              <div className="result-cuisine">{result.cuisine}</div>
            </div>
          </div>

          <div className="result-content">
            <div className="result-calories">
              <FireOutlined style={{ marginRight: '6px' }} />
              {result.calories} cal
            </div>

            <div className="result-divider" />

            <div className="result-section">
              <div className="result-section-title">
                <FileTextOutlined style={{ marginRight: '8px' }} />
                Description
              </div>
              <div className="result-description">{result.description}</div>
            </div>

            <div className="result-divider" />

            <div className="result-section">
              <div className="result-section-title">
                <UnorderedListOutlined style={{ marginRight: '8px' }} />
                Main Ingredients
              </div>
              <div className="result-ingredients">
                {result.ingredients.map((ingredient) => (
                  <div key={ingredient} className="result-ingredient-tag">
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            <div className="result-divider" />

            <div className="result-section">
              <div className="result-section-title">
                <SettingOutlined style={{ marginRight: '8px' }} />
                Your Preferences
              </div>
              <div className="preferences-grid">
                <div className="preference-item preference-item--full">
                  <span className="preference-label">Notes:</span>
                  <span className="preference-value">
                    {submittedValues.notes || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutSection>
  );  
};

export default RecommendPage;
