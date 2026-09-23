class RecommendationEngine:
    @staticmethod
    def generate_recommendations(risk_level: str, shortage: float, product_name: str) -> list:
        recs = []
        if risk_level == "CRITICAL":
            recs.append(f"EXPEDITE ORDER: Immediately order {shortage} units of {product_name} using air freight.")
            recs.append("Contact secondary suppliers to check immediate availability.")
        elif risk_level == "HIGH":
            recs.append(f"PLACE ORDER: Prepare standard order for {product_name} within the next 48 hours.")
            recs.append("Monitor supplier delay risk closely.")
        elif risk_level == "MEDIUM":
            recs.append(f"REVIEW: Check inventory levels for {product_name} next week.")
        else:
            recs.append("OPTIMIZE: Stock levels are healthy. Review for potential overstock reduction.")
        return recs
