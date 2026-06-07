"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import {
  FileTextOutlined,
  FireOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { TagOutlined } from "@ant-design/icons";

import {
  recommend,
  RecommendParams,
  RecommendResponse,
} from "@/services/api/recommend";

const { TextArea } = Input;

const cuisineOptions = [
  { value: "any", label: "Any" },
  { value: "chinese", label: "Chinese" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "mexican", label: "Mexican" },
  { value: "indian", label: "Indian" },
  { value: "thai", label: "Thai" },
  { value: "american", label: "American" },
  { value: "korean", label: "Korean" },
  { value: "french", label: "French" },
];

const mealOptions = [
  { value: "any", label: "Any" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
];

const dietaryOptions = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Keto",
  "Halal",
  "Kosher",
];

const moodOptions = [
  { value: "any", label: "Any" },
  { value: "comfort food", label: "Comfort Food" },
  { value: "healthy", label: "Healthy" },
  { value: "fancy", label: "Fancy" },
  { value: "light", label: "Light" },
  { value: "quick & easy", label: "Quick & Easy" },
  { value: "adventurous", label: "Adventurous" },
];

interface RecommendationResult {
  name: string;
  cuisine: string;
  calories: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
  notes: string;
}

const RecommendPageContent: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedDietary, setSelectedDietary] = useState<string[]>(["None"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [notesInput, setNotesInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDietaryClick = (value: string) => {
    setSelectedDietary((prev) => {
      if (value === "None") return ["None"];
      if (prev.includes("None")) return [value];
      if (prev.includes(value)) {
        const newSelection = prev.filter((item) => item !== value);
        return newSelection.length > 0 ? newSelection : ["None"];
      }
      return [...prev, value];
    });
  };

  const getErrorMessage = (error: any): string => {
    if (!error.response) {
      return "Network error, please check your connection";
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 422 && data?.detail) {
      const details = data.detail as Array<{
        msg: string;
        loc: (string | number)[];
      }>;
      const messages = details.map((d) => {
        const field = d.loc[d.loc.length - 1];
        return `${field}: ${d.msg}`;
      });
      return messages.join("; ");
    }

    if (data?.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return "Bad request, please check your input";
      case 401:
        return "Unauthorized, please login";
      case 403:
        return "Forbidden, you don't have permission";
      case 404:
        return "Not found";
      case 409:
        return "Conflict, please try again";
      case 500:
        return "Server error, please try again later";
      default:
        return `Request failed (${status})`;
    }
  };

  const mapApiToResult = (
    apiResult: RecommendResponse,
    notes: string,
  ): RecommendationResult => {
    return {
      name: apiResult.food_name,
      cuisine: apiResult.food_type + " Cuisine",
      calories: apiResult.calories,
      description: apiResult.description,
      ingredients: apiResult.ingredients
        ? apiResult.ingredients
            .replace(/^\{/, "")
            .replace(/\}$/, "")
            .split(",")
            .map((s: string) => s.trim())
        : [],
      imageUrl: apiResult.image_url,
      notes: notes || "-",
    };
  };

  const handleGenerate = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      setResult(null);

      const currentValues = form.getFieldsValue();
      const notesValue = notesInput || "";

      const apiParams: RecommendParams = {
        food_type:
          currentValues.cuisine === "any" ? "any" : currentValues.cuisine,
        meal_type: currentValues.meal === "any" ? "any" : currentValues.meal,
        dietary_restriction: selectedDietary.join(", "),
        mood: currentValues.mood === "any" ? "any" : currentValues.mood,
        additional_notes: notesValue,
        token_consumed: 1,
      };

      const apiResult: RecommendResponse = await recommend(apiParams);

      const mappedResult = mapApiToResult(apiResult, notesValue);
      setResult(mappedResult);
      setIsModalOpen(true);
      message.success("Recommendation generated successfully!");
    } catch (error: any) {
      console.error("API call failed:", error);
      const errorMsg = getErrorMessage(error);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Space direction="vertical" size="middle" className="recommend-header">
        <div className="recommend-title">What Should You Eat Today?</div>
        <div className="recommend-subtitle">
          Tell us your preferences and let AI recommend the perfect meal for
          you!
        </div>
      </Space>

      <div className="recommend-form-card">
        <Form form={form} layout="vertical" className="recommend-form">
          <Form.Item
            className="form-item"
            name="cuisine"
            initialValue="any"
            label={<div className="form-label">Cuisine Type</div>}
          >
            <Select
              options={cuisineOptions}
              className="recommend-select"
              classNames={{ popup: { root: "recommend-select-dropdown" } }}
            />
          </Form.Item>

          <Form.Item
            className="form-item"
            name="meal"
            initialValue="any"
            label={<div className="form-label">Meal Type</div>}
          >
            <Select
              options={mealOptions}
              className="recommend-select"
              classNames={{ popup: { root: "recommend-select-dropdown" } }}
            />
          </Form.Item>

          <Form.Item className="form-item">
            <div className="form-label">Dietary Restrictions</div>
            <div className="dietary-tags">
              {dietaryOptions.map((option) => (
                <div
                  key={option}
                  className={`dietary-tag ${selectedDietary.includes(option) ? "dietary-tag--active" : ""}`}
                  onClick={() => handleDietaryClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            className="form-item"
            name="mood"
            initialValue="any"
            label={<div className="form-label">Style Type</div>}
          >
            <Select
              options={moodOptions}
              className="recommend-select"
              classNames={{ popup: { root: "recommend-select-dropdown" } }}
            />
          </Form.Item>

          <div className="form-item">
            <div className="form-label">Additional Notes</div>
            <TextArea
              placeholder="Any specific preferences, allergies, or ingredients you'd like to include/avoid..."
              rows={4}
              className="recommend-textarea"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
            />
            <div className="form-hint">
              Example: &quot;No seafood&quot;, &quot;Extra spicy&quot;,
              &quot;Low carb options&quot;
            </div>
          </div>

          <Button
            type="primary"
            className="generate-button"
            onClick={handleGenerate}
            loading={loading}
            disabled={loading}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            Generate Recommendation (1 Token)
          </Button>
        </Form>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={520}
        className="recommend-modal"
        centered
        destroyOnHidden
      >
        {result && (
          <div className="result-card">
            <div className="result-image-wrapper">
              <Image
                src={result.imageUrl}
                alt={result.name}
                className="result-image"
                preview={false}
                fallback="/assets/food-fallback.webp"
                wrapperStyle={{ width: "100%", height: "100%" }}
              />
              <div className="result-image-overlay">
                <div className="result-name">{result.name}</div>
                <div className="result-cuisine">
                  <TagOutlined style={{ marginRight: "6px" }} />
                  {result.cuisine}
                </div>
              </div>
            </div>

            <div className="result-content">
              <div className="result-calories">
                <FireOutlined style={{ marginRight: "6px" }} />
                {result.calories} cal
              </div>

              <div className="result-divider" />

              <div className="result-section">
                <div className="result-section-title">
                  <FileTextOutlined style={{ marginRight: "8px" }} />
                  Description
                </div>
                <div className="result-description">{result.description}</div>
              </div>

              <div className="result-divider" />

              <div className="result-section">
                <div className="result-section-title">
                  <UnorderedListOutlined style={{ marginRight: "8px" }} />
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
                  <SettingOutlined style={{ marginRight: "8px" }} />
                  Your Preferences
                </div>
                <div className="preferences-grid">
                  <div className="preference-item preference-item--full">
                    <span className="preference-label">Notes:</span>
                    <span className="preference-value">
                      {result.notes || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RecommendPageContent;
