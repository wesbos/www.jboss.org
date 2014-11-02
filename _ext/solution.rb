require 'json'

module JBoss
  module Developer
    module Extensions
      # Post-process solution metadata from solution.yml, applying conventions
      class Solution

        def initialize

        end

        def execute(site)

          puts "Solutions..."

          site.technology_solutions = {}
          site.pages.each do |page|
            if !page.solution.nil? && page.relative_source_path.start_with?('/solutions')
              solution = page.solution
              solution.id = page.parent_dir
              
              if File.exists?('_partials/solution-partial-' + solution.id + '.html.slim')
                solution.has_partial = true
              end
              
              site.technology_solutions[solution.id] = solution
            end
          end
        end
      end

    end
  end
end
