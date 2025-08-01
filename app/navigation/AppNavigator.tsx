// app/navigation/AppNavigator.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProposalListPage } from "@/pages/ProposalListPage";
import { ProposalDetailPage } from "@/pages/ProposalDetailPage";
import { BidDetailPage } from "@/pages/BidDetailPage";
import { CreateProposalPage } from "@/pages/user/CreateProposalPage";
import { SubmitBidPage } from "@/pages/company/SubmitBidPage";
import { MyProposalsPage } from "@/pages/user/MyProposalsPage";
import { MyBidsPage } from "@/pages/company/MyBidsPage";
import { MyContractsPage } from "@/pages/MyContractsPage";
import { RewardsPage } from "@/pages/user/RewardsPage";
import { MyPage } from "@/pages/MyPage";
import { LoginPage } from "@/pages/LoginPage";
import { useUserStore } from "@/store/userStore";
import LoginModal from "@/components/LoginModal";

// ✅ 네비게이션 타입 정의
export type StackParamList = {
  Login: undefined;
  ProposalList: undefined;
  ProposalDetail: { proposalId: number };
  BidDetail: { bidId: number };
  CreateProposal: undefined;
  SubmitBid: { proposalId: number };
  MyProposals: undefined;
  MyBids: undefined;
  MyContracts: undefined;
  Rewards: undefined;
  MyPage: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function AppNavigator() {
  const { user, isWalletConnected } = useUserStore();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    if (user && !isWalletConnected) {
      setLoginModalVisible(true);
    }
  }, [user, isWalletConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginPage} />
        ) : (
          <>
            <Stack.Screen name="ProposalList" component={ProposalListPage} />
            <Stack.Screen name="ProposalDetail" component={ProposalDetailPage} />
            <Stack.Screen name="BidDetail" component={BidDetailPage} />
            <Stack.Screen name="CreateProposal" component={CreateProposalPage} />
            <Stack.Screen name="SubmitBid" component={SubmitBidPage} />
            <Stack.Screen name="MyProposals" component={MyProposalsPage} />
            <Stack.Screen name="MyBids" component={MyBidsPage} />
            <Stack.Screen name="MyContracts" component={MyContractsPage} />
            <Stack.Screen name="Rewards" component={RewardsPage} />
            <Stack.Screen name="MyPage" component={MyPage} />
          </>
        )}
      </Stack.Navigator>
      {isLoginModalVisible && <LoginModal onClose={() => setLoginModalVisible(false)} />}
    </NavigationContainer>
  );
}
