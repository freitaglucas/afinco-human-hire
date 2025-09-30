import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  type: 'application' | 'stage_change' | 'rejection' | 'feedback';
  stageName?: string;
  feedbackText?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, candidateName, jobTitle, companyName, type, stageName, feedbackText }: EmailRequest = await req.json();

    let subject = '';
    let html = '';

    switch (type) {
      case 'application':
        subject = `Candidatura recebida - ${jobTitle}`;
        html = `
          <h1>Olá, ${candidateName}!</h1>
          <p>Sua candidatura para a vaga de <strong>${jobTitle}</strong> na empresa <strong>${companyName}</strong> foi recebida com sucesso!</p>
          <p>Entraremos em contato em breve com próximos passos.</p>
          <p>Boa sorte!</p>
        `;
        break;
      
      case 'stage_change':
        subject = `Atualização no processo - ${jobTitle}`;
        html = `
          <h1>Ótimas notícias, ${candidateName}!</h1>
          <p>Você avançou para a etapa <strong>${stageName}</strong> no processo seletivo para a vaga de <strong>${jobTitle}</strong>.</p>
          <p>Fique atento ao seu email para mais informações!</p>
        `;
        break;
      
      case 'rejection':
        subject = `Atualização no processo - ${jobTitle}`;
        html = `
          <h1>Olá, ${candidateName}</h1>
          <p>Agradecemos seu interesse na vaga de <strong>${jobTitle}</strong> em <strong>${companyName}</strong>.</p>
          <p>Infelizmente, decidimos seguir com outros candidatos neste momento.</p>
          <p>Continue se candidatando às nossas vagas, adoraríamos vê-lo(a) em futuras oportunidades!</p>
        `;
        break;
      
      case 'feedback':
        subject = `Feedback do processo - ${jobTitle}`;
        html = `
          <h1>Olá, ${candidateName}</h1>
          <p>Gostaríamos de compartilhar um feedback sobre seu processo na vaga de <strong>${jobTitle}</strong>:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${feedbackText}
          </div>
          <p>Agradecemos seu interesse e desejamos sucesso em sua jornada profissional!</p>
        `;
        break;
    }

    const { error } = await resend.emails.send({
      from: "AFIN <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-application-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
